<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = [
        'url',
        'post_id',
        'user_id',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function saveImageUrl($data)
    {
        $this->url = $data["image_url"];
        $this->user_id = $data["user_id"];
        $this->post_id = $data["post_id"];
        $this->save();

        return $this;
    }
}
