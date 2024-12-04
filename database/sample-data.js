const sampleImagePath = 'fixtures/images/sample1.jpg';

const sampleData = {
	home: [
		{ sort_id: 1, header: 'header', image: sampleImagePath, paragraph_1: 'paragraph1', paragraph_2: 'paragraph2', action: 'action' }
	],
	about: [
		{ sort_id: 1, title: 'about us', image: sampleImagePath, paragraph_1: 'paragraph1', paragraph_2: 'paragraph2', paragraph_3: 'paragraph3' }
	],
	social: [
		{ sort_id: 1, image: sampleImagePath, url: 'https://www.facebook.com' },
		{ sort_id: 2, image: sampleImagePath, url: 'https://www.instagram.com' }
	],
	phone: [
		{ sort_id: 1, image: sampleImagePath, number: '+1234567890' },
		{ sort_id: 2, image: sampleImagePath, number: '+1234567890' }
	],
	gallery: [
		{ sort_id: 1, image: sampleImagePath },
		{ sort_id: 2, image: sampleImagePath }
	],
	games: [
		{
			sort_id: 1,
			title: 'sample game 1',
			description_1: 'An exciting board game...',
			description_2: 'How to play...',
			image_main: sampleImagePath,
			image_1: sampleImagePath,
			image_2: sampleImagePath,
			image_3: sampleImagePath,
			background_color: '#000000',
			text_color: '#FFFFFF',
			url: 'https://www.google.com'
		},
		{
			sort_id: 2,
			title: 'sample game 2',
			description_1: 'An exciting board game2...',
			description_2: 'How to play2...',
			image_main: sampleImagePath,
			image_1: sampleImagePath,
			image_2: sampleImagePath,
			image_3: sampleImagePath,
			background_color: '#000000',
			text_color: '#FFFFFF',
			url: 'https://www.google.com'
		},
		{
			sort_id: 3,
			title: 'sample game 3',
			description_1: 'An exciting board game3...',
			description_2: 'How to play3...',
			image_main: sampleImagePath,
			image_1: sampleImagePath,
			image_2: sampleImagePath,
			image_3: sampleImagePath,
			background_color: '#000000',
			text_color: '#FFFFFF',
			url: 'https://www.google.com'
		},
		{
			sort_id: 4,
			title: 'sample game 4',
			description_1: 'An exciting board game4...',
			description_2: 'How to play4...',
			image_main: sampleImagePath,
			image_1: sampleImagePath,
			image_2: sampleImagePath,
			image_3: sampleImagePath,
			background_color: '#000000',
			text_color: '#FFFFFF',
			url: 'https://www.google.com'
		}
	],
	email: [
		{ address: 'contact@example.com' },
	],
	media: [
		{ label: 'background_image', image: sampleImagePath },
		{ label: 'logo', image: sampleImagePath }
	]
};

export { sampleData };
