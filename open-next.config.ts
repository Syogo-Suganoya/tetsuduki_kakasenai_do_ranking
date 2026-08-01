import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// DBやキャッシュ用のR2バケット等は使わず、最小構成でCloudflare Workersにデプロイする
export default defineCloudflareConfig();
