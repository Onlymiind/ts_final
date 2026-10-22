import { ApplicationController } from './classes/ApplicationController'

new ApplicationController().start().catch((error: unknown) => {
    console.error('Application failed:', error)
    process.exitCode = 1
})
