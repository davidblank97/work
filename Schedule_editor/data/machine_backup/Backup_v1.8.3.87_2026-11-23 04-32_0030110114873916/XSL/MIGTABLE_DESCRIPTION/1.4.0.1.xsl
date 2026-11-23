<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/mig_tables/table[@id=4]" />
	
	<xsl:template match="/mig_tables/table[@id=13]">
		<xsl:copy-of select="."/>
		<table id="14">
			<name>DIPSynergic Stainless Steel 0.035</name>
			<wire_size>0.035</wire_size>
			<material>SS</material>
			<gas_type>Argon Mix</gas_type>
		</table>
	</xsl:template>
		

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>