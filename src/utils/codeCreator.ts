export default function codeCreator(startingCode:string,middleCode:string,endCode:string):string{
    return `
    ${startingCode}

    ${middleCode}

    ${endCode}
    `;
};