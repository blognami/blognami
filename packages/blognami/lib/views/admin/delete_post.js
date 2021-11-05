
export default async ({ params, renderScript, posts }) => {
    const { id } = params;

    await posts.idEq(id).delete();
    
    return renderScript(() => this.frame.frame.load());
};
