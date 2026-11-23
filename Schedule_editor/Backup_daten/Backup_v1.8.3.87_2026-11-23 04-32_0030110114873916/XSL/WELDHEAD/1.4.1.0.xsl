<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="head[@model='VHEAD-ADAPT']/axis[@name='aux0' or @name='aux1']/hard_limits">
		<hard_limits>1</hard_limits>
	</xsl:template>
		
	<xsl:template match="head[@model='VHEAD-ADAPT']/axis[@name='aux0']/*[last()]">
		<xsl:copy-of select="."/>
		<forward_hard_limit_index>0</forward_hard_limit_index>
		<reverse_hard_limit_index>1</reverse_hard_limit_index>
	</xsl:template>
	
	<xsl:template match="head[@model='VHEAD-ADAPT']/axis[@name='aux1']/*[last()]">
		<xsl:copy-of select="."/>
		<forward_hard_limit_index>2</forward_hard_limit_index>
		<reverse_hard_limit_index>3</reverse_hard_limit_index>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>