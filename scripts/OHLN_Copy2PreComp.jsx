// After Effectsスクリプト
// 選択したレイヤーを、最後に選択したプリコンポジション内に
// 元の位置関係を維持してコピーするスクリプト

(function () {
    // エラーハンドリング
    if (app.project === null) {
        alert("プロジェクトが開いていません。");
        return;
    }

    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("アクティブなコンポジションを選択してください。");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length < 2) {
        alert("少なくとも2つのレイヤーを選択してください。（例: Solid, PreCompの順）");
        return;
    }

    // 選択レイヤーの取得
    var solidLayer = selectedLayers[0]; // 最初の選択レイヤー
    var preCompLayer = selectedLayers[selectedLayers.length - 1]; // 最後の選択レイヤー

    if (!(preCompLayer.source instanceof CompItem)) {
        alert("最後に選択したレイヤーはプリコンポジションである必要があります。");
        return;
    }

    var preComp = preCompLayer.source;

    app.beginUndoGroup("Copy Layer to PreComp");

    // Solidレイヤーの位置、開始時間、長さを取得
    var solidInPoint = solidLayer.inPoint;
    var solidOutPoint = solidLayer.outPoint;
    var solidStartTime = solidLayer.startTime;

    // プロパティ取得
    var solidPosition = null;
    try {
        solidPosition = solidLayer.property("Position").value;
    } catch (e) {
        alert("Positionプロパティを取得できませんでした。レイヤーの種類を確認してください。");
        app.endUndoGroup();
        return;
    }

    // コピー先プリコンポジションでの時間調整
    var relativeOffset = solidInPoint - preCompLayer.inPoint; // SolidとPreCompの相対的な位置関係
    var timeOffset = -relativeOffset; // プリコンポジション内での開始位置を調整

    // Solidレイヤーをプリコンポジション内にコピー
    var solidSource = solidLayer.source;
    var newLayer = preComp.layers.add(solidSource);

    // 元のコンポジションから削除
    solidLayer.remove();

    // 位置関係を再設定
    newLayer.startTime = timeOffset;
    newLayer.inPoint = 0;
    newLayer.outPoint = solidOutPoint - solidInPoint;

    // Positionプロパティの設定
    if (solidPosition) {
        try {
            newLayer.property("Position").setValue(solidPosition);
        } catch (e) {
            alert("Positionプロパティを設定できませんでした。");
        }
    }

    app.endUndoGroup();

    alert("Solidレイヤーをプリコンポジション内にコピーしました。");
})();
