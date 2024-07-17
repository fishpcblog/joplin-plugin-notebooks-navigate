import joplin from 'api';
import {  ToolbarButtonLocation, SettingItemType } from 'api/types'
joplin.plugins.register({
	onStart: async function() {
		// eslint-disable-next-line no-console
		console.info('Hello world. Test plugin started!');
		await joplin.settings.registerSection('notebookNavSetting', {
			label: 'Notebook nav',
			iconName: 'fas fa-route',
		});
		await joplin.settings.registerSettings({
			'NoteBookPrefixId':{
				value:"NoteBook ",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
				type:SettingItemType.String,
				section:'notebookNavSetting',
				description:'NoteBookPrefix',
				public:true,
				label:'NoteBookPrefix',
			},
			'subNoteBookPrefixId':{
				value:" SubNoteBook ",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
				type:SettingItemType.String,
				section:'notebookNavSetting',
				description:'The current note is in the subNoteBookPrefix',
				public:true,
				label:'SubNoteBookPrefix',
			},
			'currentNoteBookPrefixId':{
				value:" Current NoteBook ",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
				type:SettingItemType.String,
				section:'notebookNavSetting',
				description:'The current note is in the NoteBookPrefix',
				public:true,
				label:'CurrentNoteBookPrefix',
			}
		});

		  await joplin.commands.register({
			name: 'insertNotebookPath',
			label: 'InsertNotebookPath',
			iconName: 'fas fa-route',
			execute: async () => {
						//	const selectFolder = await joplin.workspace.selectedNoteIds();
							//const folders = await joplin.data.get(['folders']);
							//console.log(folders);
							let selectedFolder = await joplin.workspace.selectedFolder();
						//	console.log(folders);
						//	console.log(folders.title);
				      			let p_folder
								const folderpath = [];
								let strfolderpath:string = ""; 
							//get 筆記本路徑
							do  {

								    p_folder = await joplin.data.get(['folders', selectedFolder.parent_id] );
									selectedFolder.parent_id=p_folder.parent_id
								//	console.log("do"+p_folder.parent_id);
									//console.log("do"+p_folder.title);
									folderpath.push(p_folder.title);

  	
						    } while (p_folder.parent_id!="");
							//陣列倒轉
							console.log(folderpath.reverse());
							
							for(var folderName in folderpath)
							{
								
								//父筆記本前綴
								if(folderName=="0")
								{
									strfolderpath=await joplin.settings.value('NoteBookPrefixId')+folderpath[folderName]
								}
									//子筆記本前綴
								else
								{
								strfolderpath+=await joplin.settings.value('subNoteBookPrefixId')+folderpath[folderName]
								}

							}
							//目前筆記本前綴
							strfolderpath+=await joplin.settings.value('currentNoteBookPrefixId')+selectedFolder.title	
							console.log(strfolderpath);

							await joplin.commands.execute('insertText',strfolderpath);

			}
		  });


	  
		  await joplin.views.toolbarButtons.create('focusNotebookToolbar', 'focusElementSideBar', ToolbarButtonLocation.EditorToolbar);
		  await joplin.views.toolbarButtons.create('focusNoteToolbar', 'focusElementNoteList', ToolbarButtonLocation.EditorToolbar);
		  await joplin.views.toolbarButtons.create('insertNotebookPathButton', 'insertNotebookPath', ToolbarButtonLocation.EditorToolbar);






	},
});
