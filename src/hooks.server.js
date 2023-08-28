
// export const handle: Handle = async ({ resolve, event }) => {

//   // Apply CORS header for API routes
//   if (event.url.pathname.startsWith('/api')) {
//     // Required for CORS to work
//     if(event.request.method === 'OPTIONS') {
//       return new Response(null, {
//         headers: {
//           'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Headers': '*',
//         }
//       });
//     }

//   }

//   const response = await resolve(event);
//   if (event.url.pathname.startsWith('/api')) {
    
//   }
//   return response;
// };

export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/custom')) {
	  return new Response('custom response');
	}
   
	const response = await resolve(event);
	console.info(response);
	response.headers.set('Access-Control-Allow-Origin', `*`);
	return response;
  }