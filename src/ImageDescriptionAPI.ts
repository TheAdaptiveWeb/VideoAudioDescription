import { AdapterContext, XHROptions } from 'adaptiveweb';

/**
 * Generates a caption for the image
 * @param aw the adapter context
 * @param blob the image blob
 */
export function describeImage(aw: AdapterContext, blob: Blob | null): Promise<string> {
    return aw.request('https://api.adaptiveweb.io/describe', new XHROptions({
        method: 'POST',
        data: blob,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Accept':       'application/json, text/*'
        }
    })).then(res => res.caption);
}