var c;
var canvas;
var board;
var board_width = 10;
var board_height = 10;
var pawns = [];
var filled_boxes = new Array(board_height);
var player_one_turn = true;
var selecting_color = "lime";
var player_one_color = "white";
var player_two_color = "black";
var selecting_pawn = -1;
var pawn_locked = false;
var shoot_arrow = false;
var legal_move;
var ai = true;
var play_random_game = false;
var selecting_ai_pawn;

var sketch = function (p) {
    p.setup = function () {
        c = p.createCanvas(600, 600);
        canvas = c.canvas;
        var canvasdiv = document.getElementById("canvasdiv");
        canvasdiv.appendChild(canvas);
        p.frameRate(30);
        initiate_board();
    };
    
    p.draw = function () {
        board.render(p);
        if (play_random_game) {
            p.keyCode = 82;
            p.keyPressed();
        }
        for (var i = 0; i < pawns.length; i++) {
            pawns[i].render(p);
            if (player_one_turn && pawns[i].color == player_one_color && pawns[i].check_mouse_over_pawn(p.mouseX, p.mouseY) && !pawn_locked && !shoot_arrow) {
                pawns[i].color = selecting_color;
                selecting_pawn = i;
            } else if (player_one_turn && pawns[i].color == selecting_color && !pawns[i].check_mouse_over_pawn(p.mouseX, p.mouseY) && !pawn_locked && !shoot_arrow){
                pawns[i].color = player_one_color;
                selecting_pawn = -1;
            }
            if (!ai && !player_one_turn && pawns[i].color == player_two_color && pawns[i].check_mouse_over_pawn(p.mouseX, p.mouseY) && !pawn_locked && !shoot_arrow) {
                pawns[i].color = selecting_color;
                selecting_pawn = i;
            } else if (!ai && !player_one_turn && pawns[i].color == selecting_color && !pawns[i].check_mouse_over_pawn(p.mouseX, p.mouseY) && !pawn_locked && !shoot_arrow){
                pawns[i].color = player_two_color;
                selecting_pawn = -1;
            }
            if (ai && !player_one_turn && !pawn_locked && !shoot_arrow) {
                selecting_pawn = Math.floor(Math.random() * 4);
                p.mouseClicked();
            }
        }
        if (!player_one_turn && ai) {
            var board_box_size = c.width / board_width;
            if (!shoot_arrow && Math.random() < 0.6) {
                // selecteerd af en toe vakje zoveel mogelijk naar midden
                var random_box_row = 1 + Math.floor(Math.random() * (board_width - 2));
                var random_box_column = 1 + Math.floor(Math.random() * (board_height - 2));
                legal_move = pawns[selecting_pawn].check_moving_bounderies(filled_boxes, board_width, board_height, random_box_row * board_box_size + board_box_size / 2, random_box_column * board_box_size + board_box_size / 2, p);
            } else {
                // ga soms naar pion van tegestander en shiet pijl naar pion van tegestander
                if (!shoot_arrow || !selecting_ai_pawn) {
                    selecting_ai_pawn = 4 + Math.floor(Math.random() * 4);
                }
                legal_move = pawns[selecting_pawn].check_moving_bounderies(filled_boxes, board_width, board_height, pawns[selecting_ai_pawn].x_pos * board_box_size + board_box_size / 2, pawns[selecting_ai_pawn].y_pos * board_box_size + board_box_size / 2, p);
            }
            if (!legal_move) {
                selecting_pawn = -1;
            }
            p.mouseClicked();
        }
        if (pawn_locked && !shoot_arrow) {
            legal_move = pawns[selecting_pawn].check_moving_bounderies(filled_boxes, board_width, board_height, p.mouseX, p.mouseY, p);
        }
        if (shoot_arrow) {
            legal_move = pawns[selecting_pawn].check_moving_bounderies(filled_boxes, board_width, board_height, p.mouseX, p.mouseY, p);
        }
    };

    p.mouseClicked = function () {
        if (selecting_pawn != -1) {
            pawn_locked = true;
        } else {
            pawn_locked = false;
        }
        if (legal_move && !shoot_arrow) {
            filled_boxes[pawns[selecting_pawn].y_pos][pawns[selecting_pawn].x_pos] = true;
            pawns[selecting_pawn].y_pos = legal_move[0];
            pawns[selecting_pawn].x_pos = legal_move[1];
            filled_boxes[legal_move[0]][legal_move[1]] = false;
            pawn_locked = false;
            legal_move = undefined;
            shoot_arrow = true;
            if (player_one_turn) {
                pawns[selecting_pawn].color = player_one_color;
            } else {
                pawns[selecting_pawn].color = player_two_color;
            }
        }
        if (shoot_arrow && legal_move) {
            pawns.push(new Pawn(board_width, board_height, c.width, c.height, legal_move[1], legal_move[0], "red"));
            filled_boxes[legal_move[0]][legal_move[1]] = false;
            if (player_one_turn) {
                player_one_turn = false;
            } else {
                player_one_turn = true;
            }
            pawn_locked = false;
            shoot_arrow = false;
            selecting_pawn = -1;
            legal_move = undefined;
        }
    };

    p.keyPressed = function () {
        if (p.keyCode == 27 && pawn_locked) {
            if (player_one_turn) {
                pawns[selecting_pawn].color = player_one_color;
            } else {
                pawns[selecting_pawn].color = player_two_color;
            }
            selecting_pawn = -1;
            pawn_locked = false;
            legal_move = undefined;
        }
        // press 'A' to enable/disable ai
        if (p.keyCode == 65) { 
            if (ai) ai = false; else ai = true;
        }
        // press 'R' to make random move
        if (p.keyCode == 82) {
            if (player_one_turn && !pawn_locked && !shoot_arrow) {
                selecting_pawn = 4 + Math.floor(Math.random() * 4);
                p.mouseClicked();
            } else if (!ai && !pawn_locked && !shoot_arrow) {
                selecting_pawn = Math.floor(Math.random() * 4);
                p.mouseClicked();
            }
            if ((player_one_turn || !ai) && pawn_locked && !shoot_arrow) {
                legal_move = pawns[selecting_pawn].check_moving_bounderies(filled_boxes, board_width, board_height, Math.random() * c.width, Math.random() * c.height, p);
                if (!legal_move) {
                    selecting_pawn = -1;
                }
                p.mouseClicked();
            }
            if ((player_one_turn || !ai) && shoot_arrow) {
                legal_move = pawns[selecting_pawn].check_moving_bounderies(filled_boxes, board_width, board_height, Math.random() * c.width, Math.random() * c.height, p);
                if (!legal_move) {
                    selecting_pawn = -1;
                }
                p.mouseClicked();
            }
        }
        if (p.keyCode == 80) {
            if (play_random_game) play_random_game = false; else play_random_game = true;
        }
    };
    
};

var app = new p5(sketch);

function initiate_board () {
    board = new Board(board_width, board_height, c.width, c.height);
    pawns = [new Pawn(board_width, board_height, c.width, c.height, 3, 0, "black"),
             new Pawn(board_width, board_height, c.width, c.height, 6, 0, "black"),
             new Pawn(board_width, board_height, c.width, c.height, 0, 3, "black"),
             new Pawn(board_width, board_height, c.width, c.height, 9, 3, "black"),
             new Pawn(board_width, board_height, c.width, c.height, 0, 6, "white"),
             new Pawn(board_width, board_height, c.width, c.height, 9, 6, "white"),
             new Pawn(board_width, board_height, c.width, c.height, 3, 9, "white"),
             new Pawn(board_width, board_height, c.width, c.height, 6, 9, "white")];
    for (var i = 0; i < board_height; i++) {
        filled_boxes[i] = new Array(board_width);
        for (var j = 0; j < board_width; j++) {
            filled_boxes[i][j] = true;
        }
    }

    for (var i = 0; i < pawns.length; i++) {
        filled_boxes[pawns[i].y_pos][pawns[i].x_pos] = false;
    }
}


