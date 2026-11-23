<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/sched/global/tungsten_auto_postposition">
		<xsl:copy-of select="."/>
		<reverse_downslope>0</reverse_downslope>
	</xsl:template>
	
	<xsl:template match="/sched/segment/tungsten_width">
		<xsl:copy-of select="."/>
		<reverse_travel>0</reverse_travel>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>