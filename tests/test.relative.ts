import { FlexTestUtils } from "./src/FlexTestUtils";
import { Target } from "./src/Target";

const flexTestUtils = new FlexTestUtils();

describe("relative", function () {
    this.timeout(0);
    describe("absolute", () => {
        flexTestUtils.addMochaTestForAnnotatedStructure("func x, y, w, h", {
            flex: { enabled: true },
            w: 200,
            h: 400,
            r: [0, 0, 200, 400],
            children: [
                {
                    funcX: (w: number) => 0.1 * w,
                    funcY: (w: number, h: number) => 0.15 * h,
                    funcW: (w: number) => 0.3 * w,
                    funcH: (w: number, h: number) => 0.2 * h + 5,
                    r: [20, 60, 60, 85],
                },
                { funcW: (w: number) => 0.2 * w, funcH: (w: number, h: number) => 0.1 * h, r: [60, 0, 40, 40] },
                {
                    flexItem: { enabled: false },
                    funcX: (w: number) => 0.2 * w,
                    funcY: (w: number, h: number) => 0.2 * h,
                    funcW: (w: number) => 0.2 * w,
                    funcH: (w: number, h: number) => 0.2 * h + 5,
                    r: [40, 80, 40, 85],
                },
            ],
        });

        flexTestUtils.addMochaTestForAnnotatedStructure("flex relative to absolute parent", {
            w: 600,
            h: 800,
            r: [0, 0, 600, 800],
            children: [
                {
                    flex: { enabled: true },
                    funcW: (w: number) => w / 3,
                    funcH: (w: number, h: number) => h / 2,
                    r: [0, 0, 200, 400],
                    children: [
                        {
                            funcX: (w: number) => 0.1 * w,
                            funcY: (w: number, h: number) => 0.15 * h,
                            funcW: (w: number) => 0.3 * w,
                            funcH: (w: number, h: number) => 0.2 * h + 5,
                            r: [20, 60, 60, 85],
                        },
                        { funcW: (w: number) => 0.2 * w, funcH: (w: number, h: number) => 0.1 * h, r: [60, 0, 40, 40] },
                        {
                            flexItem: { enabled: false },
                            funcX: (w: number) => 0.2 * w,
                            funcY: (w: number, h: number) => 0.2 * h,
                            funcW: (w: number) => 0.2 * w,
                            funcH: (w: number, h: number) => 0.2 * h + 5,
                            r: [40, 80, 40, 85],
                        },
                    ],
                },
            ],
        });

        flexTestUtils.addMochaTestForAnnotatedStructure("fit-to-contents containing funcW, funcH (expect 0)", {
            w: 100,
            h: 100,
            flex: { enabled: true },
            r: [0, 0, 100, 100],
            children: [
                {
                    flex: { enabled: true },
                    flexItem: { grow: 1 },
                    r: [0, 0, 100, 100],
                    children: [
                        { funcW: (w: number) => 0.3 * w, funcH: (w: number, h: number) => 0.2 * h, r: [0, 0, 0, 0] },
                        { funcW: (w: number) => 0.2 * w, funcH: (w: number, h: number) => 0.1 * h, r: [0, 0, 0, 0] },
                    ],
                },
            ],
        });

        /*
        Relative size problems:
        - when we use a relative function for one flex item on the cross axis
        - and then have our container 'grow' in the cross axis direction
        - we must not include the flex item's dynamic size in the cross axis layout calcs
        - we must update the flex item's axis size based on the new cross axis size
         */
        flexTestUtils.addMochaTestForAnnotatedStructure("dynamic main axis situation", {
            w: 100,
            h: 300,
            flex: { enabled: true, direction: "column" },
            r: [0, 0, 100, 300],
            children: [
                {
                    flex: { enabled: true },
                    w: 100,
                    h: 200,
                    flexItem: { grow: 1 },
                    r: [0, 0, 100, 300],
                    children: [
                        { w: 50, h: 100, r: [0, 0, 50, 300], flexItem: { alignSelf: "stretch" } },
                        { w: 50, funcH: (w: number, h: number) => h * 2, r: [50, 0, 50, 600] },
                    ],
                },
            ],
        });

        flexTestUtils.addMochaTestForAnnotatedStructure("dynamic main axis situation", {
            w: 100,
            h: 300,
            flex: { enabled: true, direction: "column" },
            r: [0, 0, 100, 300],
            children: [
                {
                    flex: { enabled: true, direction: "column" },
                    w: 100,
                    h: 200,
                    flexItem: { grow: 1 },
                    r: [0, 0, 100, 300],
                    children: [
                        { w: 100, h: 100, r: [0, 0, 100, 100] },
                        { w: 100, funcH: (w: number, h: number) => h * 1.5, r: [0, 100, 100, 450] },
                    ],
                },
            ],
        });

        flexTestUtils.addMochaTestForAnnotatedStructure("dynamic main axis situation - with grow", {
            w: 100,
            h: 300,
            flex: { enabled: true, direction: "column" },
            r: [0, 0, 100, 300],
            children: [
                {
                    flex: { enabled: true, direction: "column" },
                    w: 100,
                    h: 200,
                    flexItem: { grow: 1 },
                    r: [0, 0, 100, 300],
                    children: [
                        { w: 100, h: 100, r: [0, 0, 100, 100] },
                        {
                            w: 100,
                            funcH: (w: number, h: number) => h * 0.1,
                            r: [0, 100, 100, 200],
                            flexItem: { grow: 1 },
                        },
                    ],
                },
            ],
        });

        flexTestUtils.addMochaTestForAnnotatedStructure("dynamic main axis situation - with ignored grow", {
            w: 100,
            h: 300,
            flex: { enabled: true, direction: "column" },
            r: [0, 0, 100, 300],
            children: [
                {
                    flex: { enabled: true, direction: "column" },
                    w: 100,
                    h: 200,
                    flexItem: { grow: 1 },
                    r: [0, 0, 100, 300],
                    children: [
                        { w: 100, h: 100, r: [0, 0, 100, 100] },
                        {
                            w: 100,
                            funcH: (w: number, h: number) => h * 1.5,
                            r: [0, 100, 100, 450],
                            flexItem: { grow: 1 },
                        },
                    ],
                },
            ],
        });

        describe("recursive", () => {
            let root: any;
            let level1: any;
            let level2: any;
            let leaf: any;
            let abs: any;
            let sibling: any;
            let siblingSub: any;
            let siblingLeaf: any;
            let siblingAbs: any;
            before(() => {
                const structure = {
                    flex: { enabled: true },
                    r: [0, 0, 800, 200],
                    w: 800,
                    h: 200,
                    children: [
                        {
                            funcW: (w: number) => w * 0.5,
                            funcH: (w: number, h: number) => h * 0.2,
                            flex: { enabled: true },
                            r: [0, 0, 400, 40],
                            children: [
                                {
                                    funcW: (w: number) => w * 0.4,
                                    funcH: (w: number, h: number) => h * 0.2,
                                    flex: { enabled: true },
                                    r: [0, 0, 160, 8],
                                    children: [
                                        {
                                            funcW: (w: number) => w * 0.5,
                                            funcH: (w: number, h: number) => h * 0.5,
                                            flex: { enabled: true },
                                            r: [0, 0, 80, 4],
                                        },
                                        {
                                            flexItem: { enabled: false },
                                            funcW: (w: number) => w * 0.5,
                                            funcH: (w: number, h: number) => h * 0.5,
                                            x: 0,
                                            y: 0,
                                            r: [0, 0, 80, 4],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            funcW: (w: number) => w * 0.2,
                            funcH: (w: number, h: number) => h * 0.2,
                            flex: { enabled: true, padding: 10 },
                            r: [400, 0, 180, 60],
                            children: [
                                {
                                    flex: { enabled: true },
                                    r: [10, 10, 10, 40],
                                    children: [
                                        { w: 10, h: 10, r: [0, 0, 10, 10] },
                                        {
                                            flexItem: { enabled: false },
                                            funcW: (w: number) => w * 0.5,
                                            funcH: (w: number, h: number) => h * 0.5,
                                            x: 0,
                                            y: 0,
                                            r: [0, 0, 5, 20],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                };
                root = flexTestUtils.buildFlexFromStructure(structure);

                level1 = root.children[0];
                level2 = level1.children[0];
                leaf = level2.children[0];
                abs = level2.children[1];
                sibling = root.children[1];
                siblingSub = sibling.children[0];
                siblingSub.siblingSub = true;
                siblingLeaf = siblingSub.children[0];
                siblingAbs = siblingSub.children[1];

                root.update();
            });

            const getRoot = () => root;
            const addUpdateTest = (name: string, setup: (root: Target) => any) => {
                flexTestUtils.addAnnotatedUpdateTest(getRoot, name, setup);
            };

            describe("initial", () => {
                it("layouts", () => {
                    return flexTestUtils.validateAnnotatedFlex(root);
                });
            });

            addUpdateTest("update leaf", () => {
                leaf.funcW = (w: number) => w * 0.2;
                leaf.funcH = (w: number, h: number) => h * 1;
                leaf.r = [0, 0, 32, 8];
                return { layouts: [leaf, level2] };
            });

            addUpdateTest("update level2", () => {
                level2.funcW = (w: number) => w * 0.8;
                level2.funcH = (w: number, h: number) => h * 0.4;
                level2.r = [0, 0, 320, 16];
                leaf.r = [0, 0, 64, 16];
                abs.r = [0, 0, 160, 8];
                return { layouts: [leaf, level2, level1] };
            });

            addUpdateTest("update level1", () => {
                level1.funcW = (w: number) => w * 0.25;
                level1.funcH = (w: number, h: number) => h * 0.1;
                level1.r = [0, 0, 200, 20];
                level2.r = [0, 0, 160, 8];
                leaf.r = [0, 0, 32, 8];
                abs.r = [0, 0, 80, 4];
                sibling.r[0] = 200;
                return { layouts: [leaf, sibling, level2, level1, root] };
            });

            addUpdateTest("update root w,h", () => {
                root.w = 1200;
                root.h = 400;
                root.r = [0, 0, 1200, 400];
                level1.r = [0, 0, 300, 40];
                level2.r = [0, 0, 240, 16];
                leaf.r = [0, 0, 48, 16];
                abs.r = [0, 0, 120, 8];
                sibling.r = [300, 0, 260, 100];
                siblingSub.r = [10, 10, 10, 80];
                siblingAbs.r = [0, 0, 5, 40];
                return { layouts: [leaf, level2, level1, root, sibling, siblingSub] };
            });

            addUpdateTest("convert siblingSub to funcW,funcH", () => {
                siblingSub.funcX = (w: number) => w * 0.1;
                siblingSub.funcY = (w: number, h: number) => h * 0.1;
                siblingSub.funcW = (w: number) => w * 0.25;
                siblingSub.funcH = (w: number, h: number) => h * 0.25;
                siblingSub.r = [36, 20, 65, 25];
                siblingAbs.r = [0, 0, 32.5, 12.5];
                return { layouts: [sibling, siblingSub] };
            });

            addUpdateTest("convert siblingSub to fixed w,h", () => {
                siblingSub.funcX = undefined;
                siblingSub.x = 1;
                siblingSub.y = 1;
                siblingSub.funcY = undefined;
                siblingSub.funcW = undefined;
                siblingSub.w = 500;
                siblingSub.h = 500;
                siblingSub.funcH = undefined;
                siblingSub.flexItem.shrink = 0;
                siblingSub.r = [11, 11, 500, 500];
                siblingAbs.r = [0, 0, 250, 250];
                return { layouts: [sibling, siblingSub] };
            });

            addUpdateTest("convert leaf to funcW", () => {
                siblingLeaf.funcW = (w: number) => w * 0.1;
                siblingLeaf.funcH = (w: number, h: number) => h * 0.2;
                siblingLeaf.r = [0, 0, 50, 100];
                return { layouts: [siblingSub] };
            });
        });
    });
});
