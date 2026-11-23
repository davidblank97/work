<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/system_states/last_logged_in_user_name">
		<xsl:copy-of select="."/>
		<tig_sync_disabled_run_screen_configuration></tig_sync_disabled_run_screen_configuration>
		<tig_arc_sync_run_screen_configuration></tig_arc_sync_run_screen_configuration>
		<tig_no_sync_run_screen_configuration></tig_no_sync_run_screen_configuration>
		<tig_osc_sync_run_screen_configuration></tig_osc_sync_run_screen_configuration>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>