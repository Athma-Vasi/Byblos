import localforage from "localforage";
import { v4 as uuidV4 } from "uuid";

import { ApiResponseVolume, ResponseState, VolumeWithCustomId } from "../types";

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
