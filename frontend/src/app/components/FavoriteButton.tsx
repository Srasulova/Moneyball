interface FavoriteButtonProps {
    isFavorite: boolean;
    onClick: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`rounded-md mt-4 shadow-sm border border-gray-100 text-xs ${isFavorite ? 'bg-sky-900 hover:bg-red-800' : 'bg-red-800 hover:bg-sky-900'
                } font-normal px-3 py-2 text-white`}
        >
            {isFavorite ? "Unfollow" : "Follow"}
        </button>
    );
};

export default FavoriteButton;