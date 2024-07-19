import joplin from 'api';
import {  ToolbarButtonLocation, SettingItemType } from 'api/types'
import { I18n } from "i18n";
import * as path from "path";
let i18n:any;
joplin.plugins.register({
	onStart: async function() {
		// eslint-disable-next-line no-console
		console.info('Hello world. Test plugin started!');
		await localelang();
		
		await joplin.settings.registerSection('notebookNavSetting', {
			label: i18n.__("setting-noteBookNavSection"),
			iconName: 'fas fa-route',
		});
		await joplin.settings.registerSettings({
			'NoteBookPrefixId':{
				value:"NoteBook ",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
				type:SettingItemType.String,
				section:'notebookNavSetting',
				description:i18n.__("setting-noteBookPrefix-Descr"),
				public:true,
				label:i18n.__("setting-noteBookPrefix"),
			},
			'subNoteBookPrefixId':{
				value:" SubNoteBook ",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
				type:SettingItemType.String,
				section:'notebookNavSetting',
				description:i18n.__("setting-subNotebookPrefix-Descr"),
				public:true,
				label:i18n.__("setting-subNotebookPrefix"),
			},
			'currentNoteBookPrefixId':{
				value:" Current NoteBook ",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
				type:SettingItemType.String,
				section:'notebookNavSetting',
				description:i18n.__("setting-currentNoteBook-Descr"),
				public:true,
				label:i18n.__("setting-currentNoteBookPrefix"),
			}
		});

		  await joplin.commands.register({
			name: 'insertNotebookPath',
			label: i18n.__("editToolbar-insertNotebookPath"),
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
		  await joplin.commands.register({
			name: 'focusNotebook',
			label:i18n.__("editToolbar-focusNotebook"),
			iconName: 'fas fa-book',
			execute: async () => {
					await joplin.commands.execute('focusElementSideBar');

			}
			});
			await joplin.commands.register({
				name: 'focusNote',
				label: i18n.__("editToolbar-focusNote"),
				iconName: 'fas fa-compress-arrows-alt',
				execute: async () => {
						await joplin.commands.execute('focusElementNoteList');

	
				}
				});

		  await joplin.views.toolbarButtons.create('focusNotebookToolbar', 'focusNotebook', ToolbarButtonLocation.EditorToolbar);
		  await joplin.views.toolbarButtons.create('focusNoteToolbar', 'focusNote', ToolbarButtonLocation.EditorToolbar);
		  await joplin.views.toolbarButtons.create('insertNotebookPathButton', 'insertNotebookPath', ToolbarButtonLocation.EditorToolbar);





	},
});
 async function localelang() {
    const joplinLocale = await joplin.settings.globalValue("locale");
    const pluginDir = await joplin.plugins.installationDir();

    i18n = new I18n({
      locales: ["en_US","zh_TW"],
      defaultLocale: "en_US",
      fallbacks: { "en_*": "en_US" },
	  retryInDefaultLocale: false,
      syncFiles: true,
      directory: path.join(pluginDir, "locales"),
    });
    i18n.setLocale(joplinLocale);
  }