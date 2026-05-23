import { Layer, ManagedRuntime } from "effect";
import { BunContext } from "@effect/platform-bun";
import { SiteConfigTag } from "../config/site";

export function makeRuntime() {
  return ManagedRuntime.make(
    Layer.mergeAll(BunContext.layer, SiteConfigTag.Live),
  );
}
