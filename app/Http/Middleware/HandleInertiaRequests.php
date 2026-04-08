<?php

namespace App\Http\Middleware;

use App\Models\Configuration;
use App\Models\Stage;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $userStageId = $request->user()?->caasStage?->stage_id;
        $currentStageName = Stage::where('current_stage', true)->value('name');
        $userCaasStageName = $request->user()?->caasStage?->stage?->name;
        
        return [
            ...parent::share($request),

            'session' => [
                'status' =>fn () => $request-> session() -> get('status')
            ],

            'auth' => [
                'user' => fn () => $request -> user() ?$request->user() : null,
            ],

            'config' => fn () => $userStageId 
                ? Configuration::where('stage_id', $userStageId)->first() 
                : null,

            'userStageId' => $userStageId,
            'currentStageName' => $currentStageName,
            'userCaasStageName' => $userCaasStageName,
        ];
    }
}
