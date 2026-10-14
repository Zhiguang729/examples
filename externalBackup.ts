import { Readable } from "stream";

import { utils, write } from "xlsx";
import { Kysely, sql } from "kysely";
import { scheduleJob } from "node-schedule";
import { drive_v3 } from "@googleapis/drive";
import { GoogleAuth } from "google-auth-library";
import { Pool } from "pg";
import { pack } from "tar-stream";

import { Database } from "./database/database";
import { dumpDatabase } from "./backups/databaseDump";

export async function authenticate(): Promise<drive_v3.Drive> {
  // use environmental variables to store credentials
  const SCOPES = ["https://www.googleapis.com/auth/drive"];
  const BACKUP_CREDENTIALS = process.env.BACKUP_CREDENTIALS;

  if (!BACKUP_CREDENTIALS) {
    throw new Error("Missing BACKUP_CREDENTIALS environment variable");
  }

  const auth = new GoogleAuth({
    credentials: JSON.parse(BACKUP_CREDENTIALS),
    scopes: SCOPES,
  });
  const drive = new drive_v3.Drive({ auth });

  return drive;
}

export async function createBackupExcelFile(
  db: Kysely<Database>,
): Promise<Buffer> {
  const reagents = await db
    .selectFrom("reagents")
    .leftJoin("reagent_groups", "reagents.id", "reagent_groups.reagent_id_fk")
    .leftJoin("groups", "reagent_groups.group_id_fk", "groups.id")
    .select((eb) => [
      "reagents.antigen as Antigen",
      "reagents.function as Function",
      "reagents.clone as Clone",
      "reagents.conjugate as Conjugate",
      "reagents.host as Host",
      "reagents.igG_class as IgG Class",
      "reagents.product_number as Product Number",
      "reagents.supplier as Supplier",
      "reagents.lot_number as Lot Number",
      "reagents.url as URL",
      "reagents.discontinued_product as Discontinued Product",
      "reagents.rrid as RRID",
      "reagents.location as Location",
      "reagents.aliquot_number as Aliquot Number",
      "reagents.project as Project",
      "reagents.effective_antigen_retrieval as Effective Antigen Retrieval",
      "reagents.working_dilution as Working Dilution",
      "reagents.notes as Notes",
      sql<string>`array_to_string(array_agg(${eb.ref("groups.group_name")}), ', ')`.as(
        "groups",
      ),
    ])
    .groupBy("reagents.id")
    .execute();

  const worksheet = utils.json_to_sheet(reagents, {
    header: [
      "Antigen",
      "Function",
      "Clone",
      "Conjugate",
      "Host",
      "IgG Class",
      "Product Number",
      "Supplier",
      "Lot Number",
      "URL",
      "Discontinued Product",
      "RRID",
      "Location",
      "Aliquot Number",
      "Project",
      "Effective Antigen Retrieval",
      "Working Dilution",
      "Notes",
      "Groups",
    ],
  });

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Reagents");

  const sheetBuffer = write(workbook, { type: "buffer", bookType: "xlsx" });
  return sheetBuffer;
}

// upload to Google Drive
export async function uploadBackupToDrive(backupBuffer: Buffer) {
  const drive = await authenticate();

  // search for the existing backup file on Google Drive
  const existingFile = await drive.files.list({
    q: "name='reagents_backup.tar'",
    fields: "files(id)",
  });

  const media = {
    mimeType: "application/gzip",
    body: Readable.from(backupBuffer),
  };

  // set the name and folder of the new backup
  const fileMetadata = {
    name: "reagents_backup.tar",
    parents: [`${process.env.BACKUP_FOLDER}`],
  };

  let uploadResponse;

  if (existingFile.data.files?.length) {
    // if found, update the file
    const file_id = existingFile.data.files[0].id;
    if (file_id) {
      uploadResponse = await drive.files.update({
        fileId: file_id,
        media: media,
      });
    } else {
      console.error("Error: file_id is missing or invalid.");
    }
  } else {
    // if file does not exist yet, create it
    uploadResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, name, parents",
    });
  }
  if (uploadResponse) {
    console.log(
      `Backup uploaded to Google Drive with file ID: ${uploadResponse.data.id}`,
    );
  } else {
    console.log("Failed to upload to Google Drive.");
  }
}

export async function performBackup(db: Kysely<Database>, pool: Pool) {
  try {
    const excelFile = await createBackupExcelFile(db);
    const databaseDump = await dumpDatabase(pool);

    const archive = pack();

    // store contents of archive to a buffer for upload
    const chunks: Array<Buffer> = [];
    archive.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    const addEntry = (entryName: string, content: Buffer): Promise<void> => {
      return new Promise((resolve, reject) => {
        archive.entry({ name: entryName }, content, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    };

    await addEntry("reagents.xlsx", excelFile);
    await addEntry("database.sql", databaseDump);
    archive.finalize();

    const archiveContents = Buffer.concat(chunks);
    await uploadBackupToDrive(archiveContents);

    console.log("Backup completed successfully");
  } catch (error) {
    console.error("Error during backup process", error);
  }
}

// schedule the backup to run daily at 12 AM
export async function scheduleBackup(db: Kysely<Database>, pool: Pool) {
  scheduleJob("0 0 * * *", () => {
    console.log("Starting daily backup...");
    performBackup(db, pool);
  });
}
