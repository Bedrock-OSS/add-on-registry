interface RegistryEntry {
    name: string;
    creator: string;
}
type RegistryMap = Record<string, RegistryEntry>;
export const Registry: RegistryMap;
