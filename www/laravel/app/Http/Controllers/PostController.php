<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Database\QueryException;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Comment;
use App\Models\Image;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['images' => function ($query) {
            $query->orderBy('id', 'asc')->limit(1);
        }])->get();

        return Inertia::render('Home', [
            'posts' => $posts,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Post/Create', [
            'googleMapApiKey' => env('GOOGLE_MAP_API_KEY', 'API key not set.'),
            'mapId' => env('MAP_ID', 'Map ID not set.'),
            'form_input' => $request->query('form_input'),
        ]);
    }

    public function store(Request $request)
    {
        $images = $request->file('images')['acceptedFiles'] ?? [];
        $savedPaths = [];

        foreach ($images as $file) {
            $path = Storage::disk('s3')->putFile('/', $file, 'public');
            $savedPaths[] = Storage::disk('s3')->url($path);
            // $savedPaths[] = $file->store('uploads', 'public');
        }

        // dd($savedPaths);

        $onlyItems = ["title", "restaurant_name", "description", "rating", "latitude", "longitude", "address"];
        $formItems = $request->only($onlyItems);
        $request->session()->put("form_input", [$formItems, $savedPaths]);

        return redirect()->route('post.confirm');
    }

    public function confirm(Request $request)
    {
        // dd($request);

        $form_input = $request->session()->get("form_input");

        if (!$form_input) {
            return redirect()->route("post.create");
        }

        return Inertia::render('Post/Confirm', [
            "form_input" => $form_input[0],
            "image_count" => $form_input[1],
            'googleMapApiKey' => env('GOOGLE_MAP_API_KEY', 'API key not set.'),
            'mapId' => env('MAP_ID', 'Map ID not set.'),
        ]);
    }

    public function complete(Request $request)
    {
        $arrayImageUrl = $request->session()->get("form_input")[1] ?? [];
        // dd($arrayImageUrl);

        $request->validate([
            "title" => "required|string|max:255",
            "restaurant_name" => "required|string",
            "description" => "required|string",
        ]);

        DB::beginTransaction();

        try {
            $post = new Post();

            $post = $post->savePost([
                "title" => $request->title,
                "restaurant_name" => $request->restaurant_name,
                "description" => $request->description,
                "rating" => $request->rating,
                "latitude" => $request->latitude,
                "longitude" => $request->longitude,
                "address" => $request->address,
            ]);

            $postId = $post->id;

            foreach ($arrayImageUrl as $imageUrl) {
                $image = new Image();

                $image = $image->saveImageUrl([
                    "image_url" => $imageUrl,
                    "user_id" => Auth::id(),
                    "post_id" => $postId,
                ]);
            }

            DB::commit();
        } catch (QueryException $e) {
            DB::rollBack();
            throw $e;
        }

        return redirect()->route('post.index');
    }

    public function show($id)
    {
        $post = Post::with(['comments', 'images', 'users'])->findOrFail($id);
        $is_liked = $post->users()->where('user_id', auth()->id())->exists();

        return Inertia::render("Post/Show", [
            "post" => $post,
            "comments" => $post->comments,
            "likes" => $post->users->count(),
            "isLiked" => $is_liked,
            "images" => $post->images,
            'mapId' => env('MAP_ID', 'Map ID not set.'),
            'googleMapApiKey' => env('GOOGLE_MAP_API_KEY', 'API key not set.'),
            // 'bassUrl' => env('BASS_URL', 'bass url not set.'),
        ]);
    }

    public function like(Post $post)
    {
        $post->users()->attach(auth()->id());

        return redirect()->back();
    }

    public function unlike(Post $post)
    {
        $post->users()->detach(auth()->id());

        return redirect()->back();
    }
}
