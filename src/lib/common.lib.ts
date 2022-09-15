export function isRecord<K extends keyof any>(input: unknown): input is Record<K, any> {
    return typeof input === 'object'
        && input !== null
}
