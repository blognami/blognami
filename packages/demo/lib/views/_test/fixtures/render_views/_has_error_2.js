
export const styles = `
    .membership-tier {
        font-size: 0.8em;
    }
`;

export default {
    async render(){
        this.foo.bar; // this will throw an error
    }
};
