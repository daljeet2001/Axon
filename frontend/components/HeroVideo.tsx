export const HeroVideo = () => {
    return (
        <div className="flex justify-center px-4">
            <video
                src="https://videocdn.cdnpk.net/videos/74408fd8-315e-5c69-974a-f2362a5dcae3/horizontal/previews/clear/large.mp4?token=exp=1754239428~hmac=35dace01c1c209923d1dda47506ecfdeaadeec475b102b5e7746d937758654e8"
                className="w-full max-w-4xl rounded-xl shadow-lg"
                controls={false}
                muted
                autoPlay
                playsInline
                loop
            />
        </div>
    );
}
