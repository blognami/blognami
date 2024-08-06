
export const client = true;

export default {
    render(){
        console.log('rendering markdown editor preview');

        return this.renderHtml`
            <p>Hello World!</p>
        `;
    }
}
