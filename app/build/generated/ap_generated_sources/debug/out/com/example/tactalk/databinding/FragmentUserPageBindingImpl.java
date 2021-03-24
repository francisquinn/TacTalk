package com.example.tactalk.databinding;
import com.example.tactalk.R;
import com.example.tactalk.BR;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import android.view.View;
@SuppressWarnings("unchecked")
public class FragmentUserPageBindingImpl extends FragmentUserPageBinding  {

    @Nullable
    private static final androidx.databinding.ViewDataBinding.IncludedLayouts sIncludes;
    @Nullable
    private static final android.util.SparseIntArray sViewsWithIds;
    static {
        sIncludes = null;
        sViewsWithIds = null;
    }
    // views
    @NonNull
    private final androidx.constraintlayout.widget.ConstraintLayout mboundView0;
    // variables
    // values
    // listeners
    // Inverse Binding Event Handlers

    public FragmentUserPageBindingImpl(@Nullable androidx.databinding.DataBindingComponent bindingComponent, @NonNull View root) {
        this(bindingComponent, root, mapBindings(bindingComponent, root, 2, sIncludes, sViewsWithIds));
    }
    private FragmentUserPageBindingImpl(androidx.databinding.DataBindingComponent bindingComponent, View root, Object[] bindings) {
        super(bindingComponent, root, 1
            , (android.widget.TextView) bindings[1]
            );
        this.mboundView0 = (androidx.constraintlayout.widget.ConstraintLayout) bindings[0];
        this.mboundView0.setTag(null);
        this.textView8.setTag(null);
        setRootTag(root);
        // listeners
        invalidateAll();
    }

    @Override
    public void invalidateAll() {
        synchronized(this) {
                mDirtyFlags = 0x4L;
        }
        requestRebind();
    }

    @Override
    public boolean hasPendingBindings() {
        synchronized(this) {
            if (mDirtyFlags != 0) {
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean setVariable(int variableId, @Nullable Object variable)  {
        boolean variableSet = true;
        if (BR.userViewModel == variableId) {
            setUserViewModel((com.example.tactalk.user.UserViewModel) variable);
        }
        else {
            variableSet = false;
        }
            return variableSet;
    }

    public void setUserViewModel(@Nullable com.example.tactalk.user.UserViewModel UserViewModel) {
        this.mUserViewModel = UserViewModel;
        synchronized(this) {
            mDirtyFlags |= 0x2L;
        }
        notifyPropertyChanged(BR.userViewModel);
        super.requestRebind();
    }

    @Override
    protected boolean onFieldChange(int localFieldId, Object object, int fieldId) {
        switch (localFieldId) {
            case 0 :
                return onChangeUserViewModelProperty((androidx.lifecycle.LiveData<com.example.tactalk.network.user.UserProperty>) object, fieldId);
        }
        return false;
    }
    private boolean onChangeUserViewModelProperty(androidx.lifecycle.LiveData<com.example.tactalk.network.user.UserProperty> UserViewModelProperty, int fieldId) {
        if (fieldId == BR._all) {
            synchronized(this) {
                    mDirtyFlags |= 0x1L;
            }
            return true;
        }
        return false;
    }

    @Override
    protected void executeBindings() {
        long dirtyFlags = 0;
        synchronized(this) {
            dirtyFlags = mDirtyFlags;
            mDirtyFlags = 0;
        }
        com.example.tactalk.user.UserViewModel userViewModel = mUserViewModel;
        com.example.tactalk.network.user.UserProperty userViewModelPropertyGetValue = null;
        androidx.lifecycle.LiveData<com.example.tactalk.network.user.UserProperty> userViewModelProperty = null;
        java.lang.String userViewModelPropertyEmail = null;

        if ((dirtyFlags & 0x7L) != 0) {



                if (userViewModel != null) {
                    // read userViewModel.property
                    userViewModelProperty = userViewModel.getProperty();
                }
                updateLiveDataRegistration(0, userViewModelProperty);


                if (userViewModelProperty != null) {
                    // read userViewModel.property.getValue()
                    userViewModelPropertyGetValue = userViewModelProperty.getValue();
                }


                if (userViewModelPropertyGetValue != null) {
                    // read userViewModel.property.getValue().email
                    userViewModelPropertyEmail = userViewModelPropertyGetValue.getEmail();
                }
        }
        // batch finished
        if ((dirtyFlags & 0x7L) != 0) {
            // api target 1

            androidx.databinding.adapters.TextViewBindingAdapter.setText(this.textView8, userViewModelPropertyEmail);
        }
    }
    // Listener Stub Implementations
    // callback impls
    // dirty flag
    private  long mDirtyFlags = 0xffffffffffffffffL;
    /* flag mapping
        flag 0 (0x1L): userViewModel.property
        flag 1 (0x2L): userViewModel
        flag 2 (0x3L): null
    flag mapping end*/
    //end
}