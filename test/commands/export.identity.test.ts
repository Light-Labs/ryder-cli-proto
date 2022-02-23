// import { expect, test } from "@oclif/test";

// describe("identity export (missing what)", () => 
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

// describe("identity export (missing id_number)", () => 
// {
//     test.stdout()
//         .command(["export", "identity"])
//         .catch(err => 
//         {
//             expect(err.message)
//                 .to.contain("Missing")
//                 .and.to.contain("id_number");
//         })
//         .it("throws error without 'identity_id'");
// });

// describe("identity export (missing port)", () => 
// {
//     test.stdout()
//         .command(["export", "identity", "1" ])
//         .catch(err => 
//         {
//             expect(err.message)
//                 .to.contain("Missing")
//                 .and.to.contain("-R, --ryder_port");
//         })
//         .it("throws error without --ryder-port flag");
// });

// describe("identity export", () => 
// {
//     test.stdout()
//         .command(["export", "identity", "1", "-R", "MARVIN"])
//         .it('should export identity', async ctx => 
//         {
//             expect(ctx.stdout).to.contain("02121bbff845e194451b9f685cd92d08a96db7239fe052afcb3465773a3d0cd5ce0000000000000000000000000000000000000000000000000000000000000000")
//             .and.to.contain("SP2T758K6T2YRKG9Q0TJ16B6FP5QQREWZSESRS0PY")
//             .and.to.contain("ST2T758K6T2YRKG9Q0TJ16B6FP5QQREWZSE0AA71W");
//         })
// });
