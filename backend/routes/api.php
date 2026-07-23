<?php

use Illuminate\Support\Facades\Route;
use App\Models\Board;
use App\Models\KanbanList;
use App\Models\Card;

Route::get('/boards', function () {
    return Board::with('lists.cards')->get();
});

Route::post('/boards', function () {
    $board = Board::create([
        'name' => request('name', 'ForgePilot Board')
    ]);

    return response()->json($board, 201);
});

Route::post('/lists', function () {
    $list = KanbanList::create([
        'board_id' => request('board_id'),
        'name' => request('name'),
    ]);

    return response()->json($list, 201);
});

Route::post('/cards', function () {
    $card = Card::create([
        'list_id' => request('list_id'),
        'title' => request('title'),
        'description' => request('description'),
        'due_date' => request('due_date'),
    ]);

    return response()->json($card, 201);
});

Route::put('/cards/{card}', function (Card $card) {
    $card->update(request()->all());

    return response()->json($card);
});

Route::delete('/cards/{card}', function (Card $card) {
    $card->delete();

    return response()->json([
        'message' => 'Card deleted successfully'
    ]);
});