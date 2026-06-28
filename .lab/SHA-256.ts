/// <reference types="node" />
import { createHash } from "crypto";

const main = async () => {
  const pw1 = "df03dc88fb6b92fc61cf1da4338acb8816f7bf43bceb2d8a280e0c32d96852aa";
  const pw2 = "passworD";
  const pw3 = "Password-Password-Password";

  // SHA-256 ハッシュを生成
  const hash1 = createHash("sha256").update(pw1).digest("hex");
  const hash2 = createHash("sha256").update(pw2).digest("hex");
  const hash3 = createHash("sha256").update(pw3).digest("hex");

  console.log(`hash1 ${hash1}`);
  console.log(`hash2 ${hash2}`);
  console.log(`hash3 ${hash3}`);
};

main();

// 実行するには以下のコマンドを使用してください。
// npx tsx .lab/SHA-256.ts
