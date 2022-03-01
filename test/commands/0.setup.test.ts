import { expect, test } from "@oclif/test";
import { log } from "console";
import { stderr, stdin, stdout } from "process";
const wait = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms))

describe("initialise", () => 
{
    test.stdout({print: false})
        .retries(3)
        .command(["test-accept-all", "-R", "MARVIN"])
        .it('should return test-accept-all command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .command(["erase", "-R", "MARVIN"])
        .catch(err => 
        {    
            it('should return RESPONSE_ERROR_NOT_INITIALIZED error', ctx => 
            {
                expect(err.message)
                    .to.contain("RESPONSE_ERROR_NOT_INITIALIZED");
            });
        }, {raiseIfNotThrown: false}) //Ignore potential error.
        .it('should erase the Ryder (if needed)');

    test.stdout({print: false})
        .retries(3)
        .command(["test-normal-operation", "-R", "MARVIN"])
        .it('should return test-normal-operation command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["info", "-R", "MARVIN"])
        .it('should return uninitialised Ryder information', (ctx) => 
        {
            expect(ctx.stdout).to.contain('Uninitialised Ryder');
        });
});

// describe("erase (already erased)", () => 
// {
//     test.stdout()
//         .command(["erase", "-R", "MARVIN"])
//         .catch(err => 
//         {    
//             expect(err.message)
//                 .to.contain("RESPONSE_ERROR_NOT_INITIALIZED")
//         })
//         .it("throws not initialized error");
// });

describe("setup (missing port)", () => 
{
    test
        .command(["setup"])
        .catch(err => 
        {
            expect(err.message)
                .to.contain("Missing required flag")
                .and.to.contain("-R, --ryder_port RYDER_PORT")
        })
        .it("throws error without --ryder-port flag");
});

describe("setup", () => 
{
    test.stdout({print: false})
        .retries(3)
        .command(["test-accept-all", "-R", "MARVIN"])
        .it('should return test-accept-all command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["setup", "-R", "MARVIN"])
        .it('should return setup command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["test-normal-operation", "-R", "MARVIN"])
        .it('should return test-normal-operation command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["info", "-R", "MARVIN"])
        .it('should return initialised Ryder information', (ctx) => 
        {
            expect(ctx.stdout).to.contain('Initialised Ryder');
        });
});

describe("reject erase after setup", () => 
{
    test.stdout({print: false})
        .retries(3)
        .command(["test-reject-all", "-R", "MARVIN"])
        .it('should return test-reject-all command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["erase", "-R", "MARVIN"])
        .it('should return erase command rejection (3)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('3');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["test-normal-operation", "-R", "MARVIN"])
        .it('should return test-normal-operation command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["info", "-R", "MARVIN"])
        .it('should return initialised Ryder information (rejected erase)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('Initialised Ryder');
        });
});

describe("accept erase after setup", () => 
{
    test.stdout({print: false})
        .retries(3)
        .command(["info", "-R", "MARVIN"])
        .it('should Ryder status information', (ctx /*, done*/) => 
        {
            expect(ctx.stdout).to.contain('Ryder');
            //stderr.write(`erase command: ${ctx.stdout}`);
            //done();
        });

    test.stdout()
        .retries(3)
        .command(["test-accept-all", "-R", "MARVIN"])
        .it('should return test-accept-all command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["erase", "-R", "MARVIN"])
        .it('should return erase command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["test-normal-operation", "-R", "MARVIN"])
        .it('should return test-normal-operation command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["info", "-R", "MARVIN"])
        .it('should return uninitialised Ryder information (accepted erase)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('Uninitialised Ryder');
        });
});

describe("setup after erase", () => 
{
    test.stdout({print: false})
        .retries(3)
        .command(["test-accept-all", "-R", "MARVIN"])
        .it('should return test-accept-all command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["setup", "-R", "MARVIN"])
        .it('should return setup command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });
    
    test.stdout({print: false})
        .retries(3)
        .command(["test-normal-operation", "-R", "MARVIN"])
        .it('should return test-normal-operation command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["info", "-R", "MARVIN"])
        .it('should return initialised Ryder information', (ctx) => 
        {
            expect(ctx.stdout).to.contain('Initialised Ryder');
        });
});