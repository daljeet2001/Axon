export const HeroVideo = () => {
    return (
        <div className="flex justify-center px-4">
            <video
                src="https://videocdn.cdnpk.net/videos/74408fd8-315e-5c69-974a-f2362a5dcae3/horizontal/previews/clear/large.mp4?token=exp=1754229279~hmac=b8bbca7484e8ee7b4a6565a973495d7f9e5dbab105574304609d137bd57b7cf0"
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
