function Pawn (board_width, board_height, canvas_width, canvas_height, x_pos, y_pos, color) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.color = color;
    this.board_box_size = canvas_width / board_width;
    this.offset = 5;
    this.radius = canvas_width / (2 * board_width) - this.offset;

    this.render = function (p) {
        p.push();
        p.fill(this.color);
        p.ellipse(this.x_pos * this.board_box_size + this.board_box_size / 2, this.y_pos * this.board_box_size + this.board_box_size / 2, this.radius * 2, this.radius * 2);
        p.pop();
    };

    this.check_mouse_over_pawn = function (mouse_x, mouse_y) {
        if (mouse_x > this.x_pos * this.board_box_size &&
            mouse_x < this.x_pos * this.board_box_size + this.board_box_size &&
            mouse_y > this.y_pos * this.board_box_size &&
            mouse_y < this.y_pos * this.board_box_size + this.board_box_size) {
            return true;
        } else {
            return false;
        }
    };

    this.check_moving_bounderies = function (filled_boxes, board_width, board_height, mouse_x, mouse_y, p) {
        var legal_moves = {};
        var angle = 0;
        while (angle < 2 * Math.PI) {
            var i = this.y_pos;
            var j = this.x_pos;
            var i_step = Math.round(Math.cos(angle));
            var j_step = Math.round(Math.sin(angle));
            while (i >= 0 && i <= board_width - 1 && j >= 0 && j <= board_height - 1 && filled_boxes[i + i_step] && filled_boxes[i + i_step][j + j_step]) {
                if (!legal_moves[i + i_step]) {
                    legal_moves[i + i_step] = {};
                }
                legal_moves[i + i_step][j + j_step] = true;
                i = i + i_step;
                j = j + j_step;
            }
            angle += Math.PI / 4;
        }
        var closest_legal_move_row;
        var closest_legal_move_column;
        var closest_legal_move_distance;
        for (var row in legal_moves) {
            for (var column in legal_moves[row]) {
                if (!closest_legal_move_distance || closest_legal_move_distance > diagonal_distance(mouse_x, mouse_y, column * this.board_box_size + this.board_box_size / 2, row * this.board_box_size + this.board_box_size / 2)) {
                    closest_legal_move_row = row;
                    closest_legal_move_column = column;
                    closest_legal_move_distance = diagonal_distance(mouse_x, mouse_y, column * this.board_box_size + this.board_box_size / 2, row * this.board_box_size + this.board_box_size / 2);
                }
            }
        }
        if (closest_legal_move_row) {
            p.push();
            p.fill("limegreen");
            p.rect(closest_legal_move_column * this.board_box_size, closest_legal_move_row * this.board_box_size, this.board_box_size, this.board_box_size);
            p.pop();
            return [parseInt(closest_legal_move_row), parseInt(closest_legal_move_column)];
        } else {
            return undefined;
        }
    };

    function diagonal_distance(src_x, src_y, dst_x, dst_y) {
        var dx = Math.abs(src_x - dst_x);
        var dy = Math.abs(src_y - dst_y);
        // D = 1, D2 = 1 voor chebyshev distance en D = 1, D2 = sqrt(2) voor octile distance
        var D = 1;
        var D2 = 1;
        return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
    }
}
