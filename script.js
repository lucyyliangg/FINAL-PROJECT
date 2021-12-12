const app = (function() {
	function createWork({img, title, workPageUrl}) {
		return $(`
			<div class="workExample">
        		<a href="${workPageUrl}">
          			<img src="${img}"/>
        		</a>
        		<div class="inner">
          			<span>${title}</span>
        		</div>
      		</div>
      `);
	}

	const BASE_URL = "https://cdn.contentful.com";
	const spaceID = "70a65dvukpc7";
	const key = "HHLYxtRTBXnzkkRigNFpSJrOXdScsYhDJB_512UHQao";
	const client = contentful.createClient({
  		space: spaceID,
  		environment: 'master',
  		accessToken: key
	});

	const projectsPages = {
		traditional: {
			type: 'traditional',
			title: 'Traditional Art Projects',
		},
		design: {
			type: 'design',
			title: 'Design Projects',
		},
		other: {
			type: 'other',
			title: 'Other Projects'
		}
	};


	async function loadWorks(type) {
		const res = await client.getEntries({
			'fields.type': type,
			content_type: 'work',
		});
		const works = $('.works');
		res.items.forEach(({fields}) => {
			const work = createWork({ 
				title: fields.title, 
				img: `https:${fields.image.fields.file.url}`,
				workPageUrl: fields.link,
			});
			works.append(work);
		});
	}

	const obj = {
		_client: client,

		initialize: function() {
		},

		loadProjectsPage: function() {
			const urlSearchParams = new URLSearchParams(window.location.search);
			const params = Object.fromEntries(urlSearchParams.entries());
			const { type = "traditional" } = params;
            const projectsPage = projectsPages[type];
			
            $("title").text(`Lucy's Portfolio | ${projectsPage.title}`);
            $("#title-text > span").text(projectsPage.title);
			loadWorks(projectsPage.type);
		},
	};
	return obj;
})();

