import { exec } from "child_process";
import {
  createDataSource,
  createGenerator,
  createSchema,
  print,
} from "prisma-schema-dsl";
import { DataSourceProvider } from "prisma-schema-dsl-types";
import path from "path";
import {
  addedDocsModel,
  certificateHistoryModel,
  certificateModel,
  goodsModel,
  uploadAttachmentsModel,
  uploadImfxModel,
} from "./models";

export function generateEURSchema(
  dataSourceProvider: DataSourceProvider,
  connectionUrl: string,
) {
  const models = [
    certificateModel,
    goodsModel,
    addedDocsModel,
    certificateHistoryModel,
    uploadImfxModel,
    uploadAttachmentsModel,
  ];
  const dataSource = createDataSource("db", dataSourceProvider, connectionUrl);
  const generators = [
    createGenerator(
      "client",
      "prisma-client-js",
      process.env["NODE_ENV"] === "dev"
        ? "./node_modules/@prisma/client/eur"
        : path
            .resolve(
              process.cwd(),
              "..",
              "api",
              "node_modules",
              "@prisma",
              "client",
              "eur",
            )
            .replace(/\\/gi, "\\\\"),
    ),
  ];
  const schema = createSchema(models, [], dataSource, generators);
  return print(schema);
}

export const dbPush = async (schemaDirPath: string) => {
  try {
    const exitCode = await new Promise((resolve) => {
      exec(
        [
          `"${path.resolve(__dirname, "..", "restart.exe")}"`,
          "-push",
          // "-d",
          // schemaDirPath,
          // "-skipg",
        ].join(" "),
        (error, stdout) => {
          console.log(stdout);
          if (error != null) {
            console.log(`prisma db push exited with error ${error.message}`);
            resolve(error.code ?? 1);
          } else {
            resolve(0);
          }
        },
      );
    });

    if (exitCode != 0) {
      if (exitCode === 2) {
        console.log(`prisma db push exited with error ${exitCode}`);
        throw Error("Помилка міграції бази даних");
      }
      throw Error(`command prisma db push failed with exit code ${exitCode}`);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// export const dbPush = async (schemaPath: string) => {
//   const options = [
//     "--schema",
//     schemaPath,
//     "--skip-generate",
//     "--accept-data-loss",
//   ];
//   try {
//     const exitCode = await new Promise((resolve) => {
//       exec(
//         ["npx", "prisma", "db", "push"].concat(options).join(" "),
//         (error, stdout) => {
//           console.log(stdout);
//           if (error != null) {
//             console.log(`prisma db push exited with error ${error.message}`);
//             resolve(error.code ?? 1);
//           } else {
//             resolve(0);
//           }
//         },
//       );
//     });

//     if (exitCode != 0) {
//       throw Error(`command prisma db push failed with exit code ${exitCode}`);
//     }
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// };

// export const generate = async (schemaPath: string) => {
//   const options = ["--schema", schemaPath];
//   try {
//     const exitCode = await new Promise((resolve) => {
//       exec(
//         ["npx", "prisma", "generate"].concat(options).join(" "),
//         (error, stdout) => {
//           console.log(stdout);
//           if (error != null) {
//             console.log(`prisma generate exited with error ${error.message}`);
//             resolve(error.code ?? 1);
//           } else {
//             resolve(0);
//           }
//         },
//       );
//     });

//     if (exitCode != 0) {
//       throw Error(`command prisma generate failed with exit code ${exitCode}`);
//     }
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// };
