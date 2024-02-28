export function Content(props: {children : React.ReactNode}){
    return <div className="content-wrapper">
    <div className="content-inner">
        <div className="content">
            {props.children}
        </div>
    </div>
</div>
}