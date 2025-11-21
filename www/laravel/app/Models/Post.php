<?php

namespace App\Models;

use App\Models\User;
use App\Models\Image;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Post extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        "title",
        "restaurant_name",
        "description",
        "rating",
        "latitude",
        "longitude",
        "address",
    ];
    public function users()
    {
        return $this->belongsToMany(User::class, 'likes', 'post_id', 'user_id');
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function savePost($data)
    {
        $this->title = $data["title"];
        $this->restaurant_name = $data["restaurant_name"];
        $this->description = $data["description"];
        $this->rating = $data["rating"];
        $this->latitude = $data["latitude"];
        $this->longitude = $data["longitude"];
        $this->address = $data["address"];
        $this->save();

        return $this;
    }
}
