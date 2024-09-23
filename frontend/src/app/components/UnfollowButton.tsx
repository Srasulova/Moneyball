interface UnfollowButtonProps {
    removeFromFavorites: () => Promise<void>;
}

const UnfollowButton: React.FC<UnfollowButtonProps> = ({ removeFromFavorites }) => {
    return (
        <button
            onClick={removeFromFavorites}
            className="text-base rounded-md px-3 py-1.5 bg-red-800 hover:bg-sky-900 text-white"
        >
            Unfollow
        </button>
    );
};

export default UnfollowButton;
