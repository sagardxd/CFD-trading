class Logger {

    error(funcName: string, detail: string, error?: any) {
        console.log(`ERROR => [function: ${funcName} | detail: ${detail} | error: ${error}]`)
    }

    info(log: string) {
        console.log(`INFO => [${log}]`)
    }
}

export const logger = new Logger();