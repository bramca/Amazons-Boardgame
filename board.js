function Board (board_width, board_height, canvas_width, canvas_height) {
    this.render = function (p) {
        var side_size = canvas_width / board_width;
        var fill = ["cornsilk", "maroon"];
        for (var i = 0; i < board_height; i++) {
            for (var j = 0; j < board_width; j++) {
                p.push();
                p.fill(fill[(i + j) % 2]);
                p.rect(j * side_size, i * side_size, side_size, side_size);
                p.pop();
            }
        }
    };
}
