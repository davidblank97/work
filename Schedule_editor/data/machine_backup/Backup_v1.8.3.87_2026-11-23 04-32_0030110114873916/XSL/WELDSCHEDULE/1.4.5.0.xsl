<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="sched/global/torch_centering_height">
		<xsl:copy-of select="."/>
		<gas_flow_edit_mode>0</gas_flow_edit_mode>
	</xsl:template>
	
	<xsl:template match="sched/segment/dip_energy">
		<xsl:copy-of select="."/>
			<cv_min_current>60</cv_min_current>
			<cv_max_current>500</cv_max_current>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>