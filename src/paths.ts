const paths = {
    home() {
        return '/';
    },
    topicShow(topicSlug: string) {
        return `/topics/${topicSlug}`;
    },
    postCreate(topicSlug: string) {
        return `/topics/${topicSlug}/post/new`; 
    }, 
    postShow(topicSlug: string, postId: string) {
        return `/topics/${topicSlug}/posts/${postId}`;
    },
};

export default paths;