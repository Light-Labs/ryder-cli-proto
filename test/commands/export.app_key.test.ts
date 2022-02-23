// import { expect, test } from "@oclif/test";

// describe("app_key export (missing what)", () => 
// {
//     test.stdout()
//         .command(["export"])
//         .catch(err => 
//         {
//             expect(err.message)
//                 .to.contain("Missing")
//                 .and.to.contain("what");
//         })
//         .it("throws error without 'what'");
// });

// describe("app_key export (missing id_number)", () => 
// {
//     test.stdout()
//         .command(["export", "app_key"])
//         .catch(err => 
//         {
//             expect(err.message)
//                 .to.contain("Missing")
//                 .and.to.contain("id_number");
//         })
//         .it("throws error without 'identity_id'");
// });

// describe("app_key export (missing port)", () => 
// {
//     test.stdout()
//         .command(["export", "app_key", "1" ])
//         .catch(err => 
//         {
//             expect(err.message)
//                 .to.contain("Missing")
//                 .and.to.contain("-R, --ryder_port");
//         })
//         .it("throws error without --ryder-port flag");
// });

// describe("app_key export (missing app domain)", () => 
// {
//     test.stdout()
//         .command(["export", "app_key", "1", "-R", "MARVIN" ])
//         .catch(err => 
//             {
//                 expect(err.message)
//                     .to.contain("RESPONSE_ERROR_APP_DOMAIN_INVALID");
//             })
//             .it("throws error for missing/invalid app domain");
// });

// describe("app_key export", () => 
// {
//     test.stdout()
//         .command(["export", "identity", "1", "-R", "MARVIN"])
//         .it('should export app_key for the given domain', async ctx => 
//         {
//             expect(ctx.stdout).to.contain("687474703a2f2f52796465722e696f2c31325a725265744332797253795671666d56595a4a47457564425375464c65546f53");
//         })
// });
