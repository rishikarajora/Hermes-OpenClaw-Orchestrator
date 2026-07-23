<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Card extends Model
{
    protected $fillable = ['title', 'description', 'due_date', 'list_id'];

    public function list(): BelongsTo
    {
        return $this->belongsTo(KanbanList::class, 'list_id');
    }
}
