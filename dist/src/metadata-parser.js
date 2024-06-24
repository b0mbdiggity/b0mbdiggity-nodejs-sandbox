"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const smilezombie = async () => {
    const files = fs_1.default.createWriteStream(`smilezombie_query.txt`);
    files.on("error", (err) => {
        console.log(err);
        throw new Error();
    });
    for (let i = 1; i <= 10000; i++) {
        const result = fs_1.default.readFileSync(`metadata/${i}.json`, { encoding: "utf8" });
        const commaIdx = result.indexOf(",");
        const first = result.slice(0, commaIdx + 1);
        const second = result.slice(commaIdx + 1);
        const final = [
            first.replace("generate", "Smile Zombie"),
            `"image": "https://images.membersplus.com/prod/jdb/smile-zombie/image/${i}.png", "description": "Smile Zombies invite people to SZ-ZONE with the spirit of \\"Zombies never die, laughter never dies,\\" and join forces for laughter and happiness.",`,
            second,
        ].join("");
        console.log(final);
        if (i <= 1000) {
            files.write(`('reserved-${i}', 1, ${i}, '${final}', null),\n`);
        }
        else {
            files.write(`(null, 1, ${i}, '${final}', null),\n`);
        }
    }
    files.end();
};
const under78 = async () => {
    let i = 1;
    const files = fs_1.default.createWriteStream(`78under_query.txt`);
    files.on("error", (err) => {
        console.log(err);
        throw new Error();
    });
    fs_1.default.createReadStream(`78under_metadata.csv`)
        .pipe((0, csv_parser_1.default)())
        .on("data", async (data) => {
        files.write(`
      (
        '${data.code}',
        '{
          "name": "X-1",
          "description": "''X-1'' is the art sneakers created by the collaboration of Seven Eight Under and Coolrain, a world-renowned art toy artist.  It is a limited edition of 78 pairs of sneakers, and each comes with an NFT for authenticity verification.",
          "image": "https://storage.playdapp.com/metadata/token/x-1/image/x-1.png",
          "animation_url": "https://storage.playdapp.com/metadata/token/x-1/animation/${data.animation}",
          "attributes": [
            {
              "trait_type": "Edition No.",
              "value": ${data.no?.[0]}
            },
            {
              "trait_type": "SIZE (KR)",
              "value": ${data.size_kr}
            },
            {
              "trait_type": "SIZE (US)",
              "value": ${data.size_us}
            },
            {
              "trait_type": "SIZE (UK)",
              "value": ${data.size_uk}
            },
            {
              "trait_type": "SIZE (EU)",
              "value": ${data.size_eu}
            }
          ]
        }',
        '0xCdF85df57A580D4842b4E3fc8D81adfe12064DCA',
        '${i++}',
        '78-mtn7fallxbx87t'
      ),
      `);
    })
        .on("end", async () => {
        console.log("Read csv done");
        files.end();
    });
};
const everland = async () => {
    const files = fs_1.default.createWriteStream(`everland_query.txt`);
    files.on("error", (err) => {
        console.log(err);
        throw new Error();
    });
    for (let i = 0; i < 10000; i++) {
        const result = fs_1.default.readFileSync(`metadata/som/${i}.json`, {
            encoding: "utf8",
        });
        const commaIdx = result.indexOf(",");
        const first = result.slice(0, commaIdx + 1);
        const second = result.slice(commaIdx + 1);
        const final = [
            first,
            `"image": "https://images.membersplus.com/metadata/som/images/${i}.gif",`,
            second,
        ].join("");
        console.log(final);
        files.write(`(${i <= 67 ? `'dummy_req_id_${i + 1}'` : "null"}, 7, ${i <= 67 ? `'${i + 1}'` : "null"}, '${final}', null),\n`);
    }
    files.end();
};
everland();
//# sourceMappingURL=metadata-parser.js.map