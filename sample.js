//const TreeModel = require('tree-model');

var Test = (function () {
    //const treeDataStructure = {
    //    id: 1,
    //    name: '全社',
    //    children: [
    //        {
    //            id: 11,
    //            name: 'つくばオフィス',
    //            children: [
    //                {
    //                    id: 111,
    //                    name: 'システムアンドサービスグループ'
    //                }
    //            ]
    //        },
    //        {
    //            id: 12,
    //            name: '東京オフィス',
    //            children: [
    //                {
    //                    id: 121,
    //                    name: 'スイートプロダクトデザイングループ'
    //                },
    //                {
    //                    id: 122,
    //                    name: 'アクティブ・ラーニングデザイングループ'
    //                }
    //            ]
    //        },
    //        {
    //            id: 13,
    //            name: '不明のグループ'
    //        }
    //    ]
    //};

    //const tree = new TreeModel();


    //// 木構造のオブジェクトをパースしてRootノードオブジェクトを作成
    //const root = tree.parse(treeDataStructure);

    //const node121 = root.first(node => node.model.id === 121);
    //console.log(node121.model);
    //// modelプロパティを使えば、ノードのプロパティを取得できる。
    //// -> { id: 121, name: 'SPD' }

    const tree = new TreeModel();

    // 1. フラットな木構造のデータ
    const nodeList = [
        { id: 1, parent: 0 },
        { id: 11, parent: 1 },
        { id: 111, parent: 11 }
    ];

    // 2. 入れ子になっている木構造のオブジェクト
    const treeDataStructure = new LTT(
        nodeList,
        { key_id: 'id', key_parent: 'parent', key_child: 'children' }
    ).GetTree()[0];

    // 3. tree-model-jsのRootノードオブジェクトを作成
    const root = tree.parse(treeDataStructure);

    //console.log(JSON.stringfy(treeDataStructure, null, 2));
    const node121 = root.first(node => node.model.parent === 11);
    console.log(node121.model);
})();
