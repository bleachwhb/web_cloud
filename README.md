#Adherence Pill Project

Website  URL: adherencepillproject.parseapp.com

Please read the following for instructions https://www.dropbox.com/s/njjb6xvu0grbd7s/AdherenceProjectDocumentation.docx?dl=0


## Remaining issues:

### Common User

1. <del>Not able to sign up as pharmacy
2. Problm in uploading profile image does not immediately show up
3. Should restrict the image size
4. The position of box for 'upload image'
5. No notification for re-signup with the same name
6. Reset does not work
7. In Inbox page, we only have data in 'inbox', none in 'send'

### Doctor

1. <del>In the doctor_patientprescription page, clicking a patient leads to nowhere.
2. In the same page, search does not work.
3. <del>Prescription submission does not work, or not show the data.
4. <del>Static data in doctor home page
5. <del>In doctor_patientprescription page, toggleActive is useless
6. UpdateDosage function is currently not useful.

### Patient

1. Static data in patient/appointment page
2. <del>No display for prescription

continue...


# Typical Github Work Flow  
## 1. Get the latest code  
```
git pull origin master
```
## 2. Create your feature branch  
```
git checkout -b BRANCH_NAME   
```
## 3. Make changes
1. Edit files
2. Check file status: `git status`
3. Add changed files to buffer: `git add PATH_TO_FILE`
4. Commit changes: `git commit -m COMMIT_MESSAGE`  

## 4. After couple of commits, push to Github  
Remember to retrieve latest code once again
```
git pull origin master
```
Then push to remote
```
git push origin BRANCH_NAME
```

## 5. Go to [repo](https://github.com/AdherencePillProject/web_cloud)
### - Click `Compare & pull request`[Button](https://www.drupal.org/files/pull_request_test_highlighted.png)  

### - Choose correct base and compare branch ![Compare](https://help.github.com/assets/images/help/branch/comparing_branches.png)  

### - Click `Create pull request` ![Pull Request](https://help.github.com/assets/images/help/pull_requests/pull-request-review-page.png)  

### - If all green, click `Merge pull request`![Merge](https://help.github.com/assets/images/help/pull_requests/pullrequest-mergebutton.png)  

### - Done!
