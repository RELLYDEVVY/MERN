import { generateAssets } from "@vite-pwa/assets-generator";

generateAssets({
	preset: "minimal",
	imagePaths: ["./public/your-icon.png"],
	assetName: (type, size) => `${type}-${size.width}x${size.height}.png`,
	outputDirectory: "public",
});
