export default async function executeSingleExposure(
  expTime: number,
  expIso: number,
): Promise<{ fileUuid: string; fileHash: string }> {
  // expTimeMs equal to 0 has a special meaning, it indicates that it's a bias frame to be taken
  // at minimal exposure time possible, and instead of using a bulb mode, gphoto2 should use
  // the standard exposure mode.

  // TODO take a picture using gphoto2 bulb mode, and download it to the disk
  // See http://www.gphoto.org/doc/remote/ for CLI documentation
  // Then rename the file to uuidv4, and generate sha256 hash of the file.

  // Simulate taking exposures, adding 2 s for overhead (camera readout, data download etc.)

  await new Promise((resolve) => setTimeout(resolve, 2000 + expTime));

  // fileUuid should be uuid of the file in storage (not including file extension)
  // fileHash should be sha256 hash of the file, as hex string
  return { fileUuid: crypto.randomUUID(), fileHash: "PLACEHOLDER" };
}
