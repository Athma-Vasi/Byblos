import { ApiResponseVolume, VolumeWithCustomId } from "../types";
import { v4 as uuidV4 } from "uuid";

function insertCustomId(items: ApiResponseVolume["items"]): VolumeWithCustomId[] {
  return items.map((item) => {
    const customId = uuidV4();
    const clone = structuredClone(item);
    Object.defineProperty(clone, "customId", {
      value: customId,
      writable: false,
      enumerable: true,
      configurable: false,
    });
    return clone as VolumeWithCustomId;
  });
}

export { insertCustomId };
