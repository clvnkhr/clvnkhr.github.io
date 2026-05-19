import { ManagedRuntime } from "effect";
import { BunContext } from "@effect/platform-bun";
// Test just this line
const rt: ManagedRuntime.ManagedRuntime<any, any> = ManagedRuntime.make(BunContext.layer);
